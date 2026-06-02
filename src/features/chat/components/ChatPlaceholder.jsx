export default function ChatPlaceholder() {
    return (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50">
                <span className="text-orange-500 text-xl">💬</span>
            </div>

            <p className="text-[15px] font-semibold text-zinc-900">No conversation selected</p>

            <p className="mt-1 max-w-xs text-sm text-zinc-500">
                Pick a room from the sidebar to start chatting.
            </p>
        </div>
    );
}
