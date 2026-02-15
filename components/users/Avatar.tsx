import Image from "next/image";

import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";

/**
 * This file shows how to add live avatars like you can see them at the top right of a Google Doc or a Figma file.
 * https://liveblocks.io/docs/examples/live-avatars
 *
 * The users avatar and name are not set via the `useMyPresence` hook like the cursors.
 * They are set from the authentication endpoint.
 *
 * See pages/api/liveblocks-auth.ts and https://liveblocks.io/docs/api-reference/liveblocks-node#authorize for more information
 */

// const IMAGE_SIZE = 48;

// export function Avatar({ name, otherStyles }: { otherStyles: string; name: string }) {
//   return (
//     <div className={`${styles.avatar} ${otherStyles} h-9 w-9`} data-tooltip={name}>
//       <Image
//         src={`https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`}
//         fill
//         className={styles.avatar_picture}
//         alt={name}
//       />
//     </div>
//   );
// }

type Props = {
  name: string;
  otherStyles?: string;
};

// Generate a stable avatar number from a string (name)
const getAvatarId = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % 30;
};

const Avatar = ({ name, otherStyles }: Props) => {
  const avatarId = getAvatarId(name);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`relative h-9 w-9 rounded-full ${otherStyles}`} data-tooltip={name}>
            <Image
              src={`https://liveblocks.io/avatars/avatar-${avatarId}.png`}
              fill
              className="rounded-full"
              alt={name}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent className="border-none bg-primary-grey-200 px-2.5 py-1.5 text-xs">
          {name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Avatar;

// Source: https://liveblocks.io/examples/live-avatar-stack/nextjs-live-avatars