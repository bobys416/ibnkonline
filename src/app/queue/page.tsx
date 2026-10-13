import { redirect } from "next/navigation";

// Keep legacy bookmarks working without retaining the retired queue dashboard.
export default function RetiredQueuePage() {
  redirect("/");
}
