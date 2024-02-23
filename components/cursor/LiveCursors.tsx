import { useOthers } from "@/liveblocks.config";
import Cursor from "./Cursor";
import { COLORS } from "@/constants";
// import { LiveCursorProps } from "@/types/type";

// Display all other live cursors
// const LiveCursors = ({ others }: LiveCursorProps) => {
const LiveCursors = () => {
  const others = useOthers();

  return others.map(({ connectionId, presence }) => {
    if (presence == null || !presence?.cursor) {
      return null;
    }

    return (
      <Cursor
        key={connectionId}
        color={COLORS[Number(connectionId) % COLORS.length]}
        x={presence.cursor.x}
        y={presence.cursor.y}
        message={presence.message || ""}
      />
    );
  });
};

export default LiveCursors;
