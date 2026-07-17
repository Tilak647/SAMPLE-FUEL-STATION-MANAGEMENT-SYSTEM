function Message({ sender, text }) {

    return (
        <div
            className={
                sender === "user"
                    ? "text-end mb-3"
                    : "text-start mb-3"
            }
        >
            <div
                className={
                    sender === "user"
                        ? "alert alert-primary d-inline-block"
                        : "alert alert-success d-inline-block"
                }
            >
                {text}
            </div>
        </div>
    );
}

export default Message;