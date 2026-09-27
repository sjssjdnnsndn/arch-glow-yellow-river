import { createFileRoute } from "@tanstack/react-router";
import { InterceptApp } from "@/components/intercept-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <InterceptApp />;
}
