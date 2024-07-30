import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import kyInstance from "./ky";
import {
  BookmarkInfo,
  CommentData,
  CommentPage,
  FollowersInfo,
  LikesInfo,
  PagePost,
  UpdateUserProfile,
  UserData,
} from "@/lib/types";
import { createPost, deletePost } from "@/actions/post/actions";
import useSession from "@/hooks/useSessionProvider";
import { HTTPError } from "ky";
import { updateUserProfile } from "@/actions/user/actions";
import { useUploadThing } from "@/lib/uploadthing";
import { createComment, deleteComment } from "@/actions/comments/action";

// loading infinite posts request
export const usePostsInfiniteQuery = (
  endPoint: string,
  queryKeys: string[],
) => {
  return useInfiniteQuery({
    queryKey: queryKeys,
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/${endPoint}`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PagePost>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

// uploading a post
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();

  return useMutation({
    mutationFn: createPost,
    onSuccess: async (newPost) => {
      // query filters
      const queryFilter = {
        queryKey: ["post-feed"],
        predicate: (query) =>
          query.queryKey.includes("for-you") ||
          (query.queryKey.includes("user-posts") &&
            query.queryKey.includes(user.id)),
      } satisfies QueryFilters;
      // cancel any ongoing queries
      await queryClient.cancelQueries(queryFilter);
      // updating cache
      queryClient.setQueriesData<InfiniteData<PagePost, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      // invalidate queries if data is null
      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate: (query) => queryFilter.predicate(query) && !query.state.data,
      });
    },
  });
};

// deleting a post
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      // query filters
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };
      // cancel any ongoing queries
      await queryClient.cancelQueries(queryFilter);
      // updating cache
      queryClient.setQueriesData<InfiniteData<PagePost, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
            })),
          };
        },
      );
      // return deletedPost;
    },
  });
};

// follower information
export const useFollowInfoQuery = (
  userId: string,
  initialData: FollowersInfo,
) => {
  return useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/followers`).json<FollowersInfo>(),
    initialData: initialData,
    staleTime: Infinity,
  });
};

// follow/unfollow mutation
export const useFollowMutation = (userId: string, isFollowing: boolean) => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["follower-info", userId];

  return useMutation({
    mutationFn: () =>
      isFollowing
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      // cancel outgoing request
      await queryClient.cancelQueries({ queryKey });
      // get previous state
      const previousState = queryClient.getQueryData<FollowersInfo>(queryKey);
      // update cache
      queryClient.setQueryData<FollowersInfo>(queryKey, () => {
        if (previousState) {
          return {
            isFollowedByUser: !previousState.isFollowedByUser,
            followers:
              previousState.followers +
              (previousState.isFollowedByUser ? -1 : 1),
          };
        }
      });

      return { previousState };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData<FollowersInfo>(queryKey, context?.previousState);
    },
  });
};

// get user data query
export const useUserDataQuery = (username: string) => {
  return useQuery({
    queryKey: ["user-data", username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
    staleTime: Infinity,
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }

      return failureCount < 3;
    },
  });
};

// update profile mutation
export const useUserUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  return useMutation({
    mutationFn: ({
      profileData,
      avatar,
    }: {
      profileData: UpdateUserProfile;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(profileData),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;

      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PagePost, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => {
              return {
                nextCursor: page.nextCursor,
                posts: page.posts.map((post) => {
                  if (post.user.id === updatedUser.id) {
                    return {
                      ...post,
                      user: {
                        ...updatedUser,
                        avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                      },
                    };
                  }
                  return post;
                }),
              };
            }),
          };
        },
      );
    },
  });
};

// like query
export const useLikesQuery = (
  postId: string,
  initialData: LikesInfo,
  queryKey: QueryKey,
) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikesInfo>(),
    initialData: initialData,
    staleTime: Infinity,
  });
};

// like/unlike mutation
export const useLikesMutation = (queryKey: QueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      isLikedByUser,
      postId,
    }: {
      isLikedByUser: boolean;
      postId: string;
    }) =>
      isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      // cancel outgoing request
      await queryClient.cancelQueries({ queryKey });
      // get previous likes data
      const previousState = queryClient.getQueryData<LikesInfo>(queryKey);

      // update cache
      queryClient.setQueryData<LikesInfo>(queryKey, () => {
        if (previousState) {
          return {
            isLikedByUser: !previousState.isLikedByUser,
            likes: previousState.likes + (previousState.isLikedByUser ? -1 : 1),
          };
        }
      });

      return { previousState };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData<LikesInfo>(queryKey, context?.previousState);
    },
  });
};

// bookmark query
export const useBookmarkQuery = (
  postId: string,
  initialData: BookmarkInfo,
  queryKey: QueryKey,
) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmarks`).json<BookmarkInfo>(),
    initialData: initialData,
    staleTime: Infinity,
  });
};

// bookmark/unbookmark mutation
export const useBookmarkMutation = (queryKey: QueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      isBookmarkedByUser,
      postId,
    }: {
      isBookmarkedByUser: boolean;
      postId: string;
    }) =>
      isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmarks`)
        : kyInstance.post(`/api/posts/${postId}/bookmarks`),
    onMutate: async () => {
      // cancel outgoing request
      await queryClient.cancelQueries({ queryKey });
      // get previous bookmark data
      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);
      // update cache
      queryClient.setQueryData<BookmarkInfo>(queryKey, () => {
        if (previousState) {
          return {
            isBookmarkedByUser: !previousState.isBookmarkedByUser,
          };
        }
      });

      return { previousState };
    },
    onError(err, variables, context) {
      queryClient.setQueryData<BookmarkInfo>(queryKey, context?.previousState);
    },
  });
};

// comment mutation
export const useCommentMutation = (postId: string) => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["comments", postId];

  return useMutation({
    mutationFn: createComment,
    onSuccess: async (newComment) => {
      // cancel outgoing request
      await queryClient.cancelQueries({ queryKey });
      // update cache
      queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  previousCursor: firstPage.previousCursor,
                  comments: [...firstPage.comments, newComment],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });
    },
  });
};

// infinite comments query
export const useCommentsInfiniteQuery = (postId: string) => {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/posts/${postId}/comments`,
          pageParam
            ? {
                searchParams: { cursor: pageParam },
              }
            : {},
        )
        .json<CommentPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (firstPage) => firstPage.previousCursor,
    select(data) {
      return {
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      };
    },
  });
};

// delete comments mutations
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ["comments", deletedComment.postId];
      // cancel outgoing queries
      await queryClient.cancelQueries({ queryKey });
      // update cache
      queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter(
                (comment) => comment.id !== deletedComment.id,
              ),
            })),
          };
        },
      );
    },
  });
};
