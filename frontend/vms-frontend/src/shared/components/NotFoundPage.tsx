import { Button } from "@/shared/shad-ui/ui/button";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <>
            <div className="flex-grow space-y-10">
                <div className="h-full">
                    <div className="mt-8 pb-8 py-8 sm:px-4 md:px-10 px lg:px-40 px h-full flex flex-col items-center">
                        <h1 className="font-bold text-5xl mb-8">Page not found!</h1>
                        <Link to="/">
                            <Button>
                                Go back to homepage
                            </Button>
                        </Link>
                    </div>
                </div>
            </div >
        </>
    );
};
export default NotFoundPage;
