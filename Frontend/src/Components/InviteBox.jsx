import { MailPlus } from "lucide-react";
import API from "../api";
import { toast } from "react-toastify";
import { useState } from "react";

function InviteBox({ boardId, onInvited }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function inviteUser() {
    if (!email.trim()) return toast.error("Enter an email");

    try {
      setLoading(true);
      const res = await API.post("/boards/invite", {
        boardId,
        email,
      });

      toast.success("User invited successfully!");
      setEmail("");
      onInvited(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invite failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <MailPlus className="h-5 w-5 text-blue-600" />
        Invite Collaborator
      </h3>

      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter user's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={inviteUser}
          disabled={loading}
          className={`px-4 rounded-lg text-white font-semibold ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Inviting..." : "Invite"}
        </button>
      </div>
    </div>
  );
}

export default InviteBox;
