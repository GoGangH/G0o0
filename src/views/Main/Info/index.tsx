import Image from "next/image";

const MyInfo = () => {
  return (
    <div>
      <div className="flex">
        <div className="text-accent">안녕하세요.</div>
        <Image
          src="/info/profile.jpg"
          alt="profile"
          className="rounded-full border-[1px] border-black"
          height={120}
          width={120}
        />
      </div>
    </div>
  );
};

export default MyInfo;
