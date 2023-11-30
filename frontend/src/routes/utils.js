import { Suspense, lazy } from "react";
// components
import LoadingScreen from "src/components/loading-screen";

export const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

export { lazy };
