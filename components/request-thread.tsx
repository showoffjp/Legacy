import { postRequestMessage } from "@/app/requests/actions";
import type { RequestMessageRow } from "@/lib/server/messaging";

/**
 * The shared conversation on a coordination request. Server-rendered;
 * posting goes through one access-controlled action for every role.
 */

const ROLE_LABELS: Record<RequestMessageRow["author_role"], string> = {
  family: "Family",
  partner: "Partner",
  coordinator: "Legacy",
};

const ROLE_STYLES: Record<RequestMessageRow["author_role"], string> = {
  family: "bg-gold-pale/50 border-gold/30",
  partner: "bg-sage-pale/60 border-sage/30",
  coordinator: "bg-white border-line",
};

function when(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function RequestThread({
  requestId,
  messages,
  viewerRole,
}: {
  requestId: string;
  messages: RequestMessageRow[];
  viewerRole: RequestMessageRow["author_role"];
}) {
  return (
    <details className="mt-4 rounded-xl border border-line bg-parchment px-4 py-3" open={messages.length > 0}>
      <summary className="cursor-pointer text-sm font-medium text-ink">
        Messages{messages.length > 0 ? ` (${messages.length})` : ""}
      </summary>

      {messages.length > 0 ? (
        <ul className="mt-3 space-y-2.5">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`rounded-xl border px-4 py-2.5 ${ROLE_STYLES[message.author_role]}`}
            >
              <p className="text-sm leading-relaxed text-ink">{message.body}</p>
              <p className="mt-1 text-xs text-ink-faint">
                {ROLE_LABELS[message.author_role]} · {message.author_name} ·{" "}
                {when(message.created_at)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-ink-faint">
          {viewerRole === "family"
            ? "Ask anything — your funeral home, minister, and Legacy coordinator all see this thread."
            : "No messages yet. Anything you write here reaches the family and the coordinator."}
        </p>
      )}

      <form action={postRequestMessage} className="mt-3 flex items-end gap-2">
        <input type="hidden" name="requestId" value={requestId} />
        <label className="flex-1">
          <span className="sr-only">Write a message</span>
          <textarea
            name="body"
            required
            rows={2}
            placeholder="Write a message…"
            className="w-full resize-y rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="btn-sheen rounded-full bg-gradient-to-b from-[#bd9a54] to-[#8f7440] px-5 py-2.5 text-sm font-medium text-white shadow-[0_2px_8px_rgba(163,131,63,0.35)] transition-all hover:-translate-y-px"
        >
          Send
        </button>
      </form>
    </details>
  );
}
