import { useQuery } from "convex/react";
import { MessageSquare, Users } from "lucide-react";
import { usePathname } from "next/navigation"
import { useMemo } from "react";
import { api } from "../../convex/_generated/api";

export const useNavigation = () => {
    const pathname = usePathname();

    const requestsCount = useQuery(api.requests.count);
    const conversations = useQuery(api.conversations.get);

    const unseenMessagesCount = useMemo(() => {
        return conversations?.reduce((acc, curr) => {
            return acc + curr.unseenCount
        }, 0)
    }, [conversations])

    const paths = useMemo(()=> [
        {
            name: "Conversations",
            path: "/conversations",
            icon: <MessageSquare />,
            active: pathname.startsWith("/conversations"),
            count: unseenMessagesCount
        },
        {
            name: "Friends",
            path: "/friends",
            icon: <Users />,
            active: pathname === "/friends",
            count: requestsCount
        }

    ], [pathname, requestsCount, unseenMessagesCount])

    return paths;
}