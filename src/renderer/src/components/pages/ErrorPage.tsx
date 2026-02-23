import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  console.error(error);

  return (
    <>
      <div className="flex flex-col min-h-full pt-16 pb-12 bg-base-100">
        <main className="flex flex-col justify-center flex-grow w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="text-center">
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-base-content sm:text-5xl">
                Uh oh!, something went wrong!
              </h1>
              <p className="mt-2 text-base text-base-content/50">Sorry, we couldn’t find what you’re looking for.</p>
              <div className="mt-6">
                <Link to={"/"} className="text-base font-medium text-primary hover:text-primary/80">
                  Go back home
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
