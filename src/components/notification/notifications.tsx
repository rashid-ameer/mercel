"use client";
import { InfiniteScroll } from "@/components";
import { CircularLoader, PostsLoadingSkeleton } from "@/components/loaders";
import {
  useMarkAsReadMutation,
  useNotificationsInfiniteQuery,
  usePostsInfiniteQuery,
} from "@/lib/react-query-utils";
import Notification from "./notification";
import { useEffect } from "react";

function Notifications() {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useNotificationsInfiniteQuery();
  const { mutate } = useMarkAsReadMutation();

  const notifications = data?.pages.flatMap((page) => page.notifications) ?? [];

  const handleBottomReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <>
      <InfiniteScroll
        className="space-y-5"
        onBottomReached={handleBottomReached}
      >
        {status === "pending" && <PostsLoadingSkeleton />}
        {status === "error" && (
          <p className="text-center text-destructive">
            Error while fetching notifications.
          </p>
        )}
        {status === "success" && notifications.length === 0 && !hasNextPage && (
          <p className="text-center text-muted-foreground">
            No notifications to show.
          </p>
        )}

        {notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}

        {isFetchingNextPage && <CircularLoader />}
      </InfiniteScroll>
    </>
  );
}
export default Notifications;
