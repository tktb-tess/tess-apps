import { RiExternalLinkLine } from "react-icons/ri";

type Props = {
    children: React.ReactNode;
    href: string;
    className?: string;
};

const ExtLink = ({ children, href, className }: Props) => {
    return (
        <a href={href} className={className} target="_blank" rel='noopener'>
            {children}
            <RiExternalLinkLine className="size-4 inline-block" fill="currentColor" />
        </a>
    );
};

export default ExtLink;
