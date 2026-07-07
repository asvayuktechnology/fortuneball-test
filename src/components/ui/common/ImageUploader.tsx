import React, { useState } from "react";
type Props = {
    handdleImageSelect: (file: any) => void
}
const ImageUploader = (Props: Props) => {
    const { handdleImageSelect } = Props;
    const [image, setImage] = useState<string | null>(null);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            handdleImageSelect(file)
        }
    };

    const handleReset = () => {
        setImage(null);
    };

    return (
        <div className="flex items-center gap-6">
            {image ? (
                <div className="flex flex-col gap-4">
                    <img className="w-40 h-40" src={image} />
                    <span className="text-md capitalize text-white bg-[#242424] flex items-center justify-center rounded-md max-w-[150px] cursor-pointer" onClick={handleReset}>Remove</span>
                </div>
            ) : (
                <div className="">
                    <label htmlFor="image_uploader" className="uploadbtn bg-[#242424] text-white px-4 py-2 rounded-md max-w-[150px] w-[150px] h-[40px] content-center text-center">Browse File</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className=" hidden"
                        id="image_uploader"
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
