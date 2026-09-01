import { Compass } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-16">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you're looking for doesn't exist or may have moved."
        action={<LinkButton to="/">Back to home</LinkButton>}
      />
    </div>
  );
}
