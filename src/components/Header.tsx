import Link from "next/link";

const Header = () => {
  const CATEGORYS = [
    {
      title: "Posts",
      link: "/posts",
    },
    {
      title: "Profile",
      link: "/profile",
    },
  ];
  return (
    <div className="h-16 border-b fixed w-full flex items-center justify-center bg-gray-300">
      <div className="max-w-3xl w-full flex items-center justify-between">
        <Link href="/">
          <p>G0o0</p>
        </Link>
        <div className="flex items-center gap-2">
          {CATEGORYS.map((category) => (
            <CategoryItem key={category.title} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;

interface CategoryItemProps {
  category: {
    title: string;
    link: string;
  };
}
const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
  return (
    <Link href={category.link} className="hover:border-b-1">
      <p>{category.title}</p>
    </Link>
  );
};
