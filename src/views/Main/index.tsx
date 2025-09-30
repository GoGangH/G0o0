import GitHubInfo from "./Github";
import MyInfo from "./Info";

const MainView = () => {
  return (
    <div className="w-full">
      <MyInfo />
      <GitHubInfo />
    </div>
  );
};

export default MainView;
