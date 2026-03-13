import Lottie from "lottie-react";
import loaderLight from "@/assets/loader-working-black.json";
import loaderDark from "@/assets/loader-working-white.json";

function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-24 w-24 dark:hidden">
          <Lottie animationData={loaderLight} loop autoplay />
        </div>

        <div className="hidden h-24 w-24 dark:block">
          <Lottie animationData={loaderDark} loop autoplay />
        </div>

        <div className="text-sm text-muted-foreground">
          Building your strategy & calendar…
        </div>
      </div>
    </div>
  );
}

export default Loader;
