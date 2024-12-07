import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./CategoryPage.css";
import { useNavigate } from "react-router-dom";

const CategoryPage = () => {
  const navigate = useNavigate();

  const handleWriteButtonClick = () => {
    // 글쓰기 버튼 클릭 시 /product/upload로 이동
    navigate("/product/upload");
  };

  const { category } = useParams(); // URL에서 카테고리 값 추출
  const [selling, setSelling] = useState("sell"); // 기본 필터는 '팔아요'
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const [userIdx, setUserIdx]=useState(null);
  const [user, setUser] = useState(null); // 현재 로그인한 사용자 정보 저장
  
  // 현재 로그인 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8080/user/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          if (response.data && response.data.user) {
            setUser(response.data.user);
            setUserIdx(response.data.user.userIdx);
          }
        })
        .catch((error) => {
          console.error("사용자 정보를 가져오는 중 오류 발생:", error);
        });
    }
  
    const isAdminStored = localStorage.getItem("isAdmin");
    setIsAdmin(JSON.parse(isAdminStored)); // 초기 isAdmin 설정
  }, []);
  
  // 상품 목록 요청
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/product", {
          params: {
            selling,
            category: category === "all" ? "all" : category,
            order: "new", // 기본 정렬: 최신순
            isAdmin: isAdmin,
          },
        });

        if (response.data.code === "1000") {
          console.log(
            `Fetched products for ${category} (${selling}):`,
            response.data.data,
          );
          setProducts(response.data.data);
        } else {
          console.error("Failed to fetch products:", response.data.message);
          setProducts([]); // 실패 시 빈 배열로 설정
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // 에러 발생 시 빈 배열로 설정
      }
    };

    fetchProducts();
  }, [category, selling, isAdmin]);

  return (
    <div className="category-page">
      {/* 팔아요/구해요 필터 */}
      <div className="category-page-filter-bar">
        <div className="category-page-left-buttons">
          <button
            className={selling === "sell" ? "active" : ""}
            onClick={() => setSelling("sell")}
          >
            팔아요
          </button>
          <button
            className={selling === "get" ? "active" : ""}
            onClick={() => setSelling("get")}
          >
            구해요
          </button>
        </div>

        {/* 글쓰기 버튼은 우측 끝에 배치 */}
        <div className="button-container">
          {user && user.userIdx && !isAdmin && (
            <button
              className="category-page-write-button"
              onClick={() => navigate('/product/upload')}
            >
              글쓰기
            </button>
          )}
          <button
            className="search-button"
            onClick={() => navigate('/search')}
          >
            상품 검색
          </button>
</div>


      </div>
      {/* 상품 목록 */}
      <div className="product-gallery">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.product_idx}
              className={`product-wrapper ${
                product.status === "removed" || product.status === "completed"
                  ? "inactive-product"
                  : ""
              }`}
            >
              <Link
                to={`/product/${product.productIdx}`}
                className="product-card"
              >
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p>{product.price}원</p>
                  <p>{product.location}</p>
                  <p>
                    ♡ {product.heartNum} 💬 {product.chatNum}
                  </p>
                  {/* 상태에 따른 텍스트 표시 */}
                  {product.status === "removed" && (
                    <p className="product-status">삭제</p>
                  )}
                  {product.status === "completed" && (
                    <p className="product-status">거래 완료</p>
                  )}
                </div>
                <img
                  src={`http://localhost:8080/image?image=${product.image}`}
                  alt={product.title}
                />
              </Link>
            </div>
          ))
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
