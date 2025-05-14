import { useInviteMemberModalHook } from "@/features/projects/hooks/use-invite-member-modal";
import Image from "next/image";
import { IoAddSharp } from "react-icons/io5";

export default function ProjectMembers() {
  const MembersFound = [
    {
      id: "1",
      image:
        "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "John Doe",
    },
    {
      id: "2",
      image:
        "https://i.pinimg.com/736x/37/b0/8e/37b08e188a88303da193785f5ab47c74.jpg",
      name: "John Doe2",
    },
    {
      id: "3",
      image:
        "https://i.pinimg.com/736x/4a/8b/39/4a8b39545731f7fe0817d3d01fe68d97.jpg",
      name: "John Doe3",
    },
    {
      id: "4",
      image:
        "https://i.pinimg.com/736x/92/e5/61/92e561ab8c0fc5497d1151d2d13cf47b.jpg",
      name: "John Doe4",
    },
    {
      id: "5",
      image:
        "https://i.pinimg.com/736x/d6/26/65/d62665e29d99e6a036216f9dbf7643c8.jpg",
      name: "John Doe5",
    },
  ];
  const { open } = useInviteMemberModalHook();

  return (
    <div className="flex items-center space-x-2">
      {MembersFound.length > 3 ? (
        <div className="flex items-center">
          {MembersFound.slice(0, 3).map((member, index) => (
            <div
              className="relative h-8 w-8 rounded-full overflow-hidden"
              style={{
                marginLeft: index === 0 ? "0" : "-16px",
                zIndex: MembersFound.length - index,
              }}
              key={member.id}
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
          ))}
          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-200 cursor-pointer">
            <p className="text-muted-foreground text-sm">
              {MembersFound.length - 3}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex">
          {MembersFound.map((member, index) => (
            <div
              className="relative h-8 w-8 rounded-full overflow-hidden"
              style={{
                marginLeft: index === 0 ? "0" : "-16px",
                zIndex: MembersFound.length - index,
              }}
              key={member.id}
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
      <div
        className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 cursor-pointer"
        onClick={open}
      >
        <IoAddSharp className="h-4 w-4 text-gray-600" />
      </div>
    </div>
  );
}
