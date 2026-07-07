import React from "react";
interface AvatarProps {
    image?: string;
    alt?: string;
    size?: number;
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
    image,
    alt = "User Avatar",
    size = 40,
    className = "",
}) => {
    const defaultImage = "/images/user_placeholdeer.png";

    return (
        <img
            src={image || defaultImage}
            alt={alt ?? 'avtar'}
            className={`rounded-full object-cover ${className}`}
            style={{ width: size, height: size }}
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = defaultImage;
            }}
        />
    );
};

export default Avatar;
