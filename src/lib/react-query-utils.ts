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
import { FollowersInfo, PagePost } from "./types";
import { createPost, deletePost } from "@/actions/post/actions";

// loading infinite posts request
export const usePostsInfiniteQuery = () => {
  return useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/for-you",
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

  return useMutation({
    mutationFn: createPost,
    onSuccess: async (newPost) => {
      // query filters
      const queryFilter: QueryFilters = { queryKey: ["post-feed", "for-you"] };
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
        predicate: (query) => !query.state.data,
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
