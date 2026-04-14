export default function NavbarSkeleton({ isAuth = false }) {
    return (
        <div className="w-full bg-[#F8F8FF] border-b border-gray-200">
            <div className="mx-auto px-20 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="h-12 w-32 bg-gray-200 rounded-md animate-pulse" />

                {/* Center Links */}
                <div className="hidden md:flex items-center gap-10">
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                </div>

                {/* Right Side */}
                {!isAuth ? (
                    <div className="flex items-center gap-6">
                        <div className="h-5 w-14 bg-gray-200 rounded animate-pulse" />
                        <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                ) : (
                    <div className="flex items-center gap-8">
                        {/* Notification icon */}
                        <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />

                        {/* Avatar */}
                        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                )}
            </div>
        </div>
    );
}

const SkeletonItem = () => {
    return <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />;
};
