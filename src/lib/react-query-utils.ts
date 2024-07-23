import {
  InfiniteData,
  QueryFilters,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import kyInstance from "./ky";
import { PagePost } from "./types";
import { createPost } from "@/actions/post/actions";

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
