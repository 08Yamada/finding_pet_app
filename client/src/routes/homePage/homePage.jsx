import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {

  // const {currentUser} = useContext(AuthContext)

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Reptile Rearing Methods Finder</h1>
          <p>
            爬虫類の育成方法を見る
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>500種類</h1>
              <h2>掲載予定</h2>
            </div>
            <div className="box">
              <h1>簡単な検索</h1>
              <h2>爬虫類を知れる</h2>
            </div>
            <div className="box">
              <h1>独自の育成方法</h1>
              <h2>公開可能</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
