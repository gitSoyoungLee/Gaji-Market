// MyPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPage.css';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('판매내역');
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [pointAmount, setPointAmount] = useState(0);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 사용자 프로필 정보에서 이메일을 추출해서 특정 사용자 정보 요청
    axios.get('http://localhost:8080/user/profile', {
      headers: {
        Authorization: token,
      },
    })
    .then(response => {
      if (response.data && response.data.id) {
        const userEmail = response.data.id; // 로그인된 사용자의 이메일
        // 이메일을 사용해 특정 사용자 정보 가져오기
        return axios.get(`http://localhost:8080/user/${userEmail}`, {
          headers: {
            Authorization: token,
          },
        });
      } else {
        throw new Error("유효하지 않은 사용자 데이터입니다.");
      }
    })
    .then(response => {
      const userData = response.data;
      // 사용자의 포인트 정보 가져오기
      return axios.get(`http://localhost:8080/user/${userData.id}/point`, {
        headers: {
          Authorization: token,
        },
      }).then(pointResponse => {
        setUserInfo({ ...userData, points: pointResponse.data.point || 0 });
        // 사용자의 판매 상품 정보 가져오기
        return axios.get(`http://localhost:8080/user/${userData.id}/selling`, {
          headers: {
            Authorization: token,
          },
        }).then(sellingResponse => {
          setProducts(sellingResponse.data);
          // 사용자의 찜 목록 정보 가져오기
          return axios.get(`http://localhost:8080/user/${userData.id}/get/wishlist`, {
            headers: {
              Authorization: token,
            },
          });
        });
      });
    })
    .then(response => {
      setWishlist(response.data);
    })
    .catch(error => {
      console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      if (error.response && error.response.status === 401) {
        alert('로그인 정보가 만료되었습니다. 다시 로그인 해주세요.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    });
  }, [navigate]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  const handleOpenPointModal = () => {
    setIsPointModalOpen(true);
  };

  const handleClosePointModal = () => {
    setIsPointModalOpen(false);
  };

  const handleOpenWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
  };

  const handleCloseWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
  };

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleAuthSubmit = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    axios.post(`http://localhost:8080/user/${userInfo.id}/auth`, {
      password: password
    }, {
      headers: {
        Authorization: token,
      },
    })
    .then(response => {
      if (response.data.authenticated) {
        alert('인증에 성공했습니다. 정보를 수정할 수 있습니다.');
        navigate(`/user/${userInfo.id}/edit`);
      } else {
        alert('비밀번호가 틀렸습니다. 다시 시도해주세요.');
      }
      handleCloseAuthModal();
    })
    .catch(error => {
      console.error('인증 중 오류 발생:', error);
      alert('인증 중 오류가 발생했습니다.');
    });
  };

  const handlePointChange = (e) => {
    setPointAmount(e.target.value);
  };

  const handlePointSubmit = (isWithdraw) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const amount = parseInt(pointAmount, 10);
    const finalAmount = isWithdraw ? -amount : amount;

    axios.post(`http://localhost:8080/user/${userInfo.id}/point/update`, {
      amount: finalAmount
    }, {
      headers: {
        Authorization: token,
      },
    })
    .then(response => {
      alert(response.data);
      setUserInfo(prevState => ({
        ...prevState,
        points: prevState.points + finalAmount
      }));
      if (isWithdraw) {
        handleCloseWithdrawModal();
      } else {
        handleClosePointModal();
      }
    })
    .catch(error => {
      console.error('포인트 업데이트 중 오류 발생:', error);
      alert('포인트 업데이트 중 오류가 발생했습니다.');
    });
  };

  if (!userInfo) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="my-page">
      <div className="header-section">
        <div className="user-info">
          <div className="user-avatar"></div>
          <div className="user-details">
            <div className="user-email">{userInfo.id}</div>
            <div className="user-name">{userInfo.name}</div>
            <div className="user-message">{userInfo.message}</div>
          </div>
        </div>
        <div className="points-section">
          <div className="points-box">
            <div className="points-value">{userInfo.points || 0}</div>
            <div className="points-label">포인트</div>
            <button className="point-button" onClick={handleOpenPointModal}>포인트 충전</button>
            <button className="point-button" onClick={handleOpenWithdrawModal}>포인트 인출</button>
          </div>
          <div className="points-box">
            <div className="points-value">{userInfo.mannerPoint}</div>
            <div className="points-label">매너 지수</div>
          </div>
        </div>
        <button className="edit-button" onClick={handleOpenAuthModal}>내 정보 수정</button>
        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
      </div>

      <div className="tabs-section">
        {['판매내역', '구매내역', '채팅', '찜 목록', '문의 내역', '신고 내역'].map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {activeTab === '판매내역' && (
        <div className="product-list">
          {products.length > 0 ? (
            products.map(product => (
              <div key={product.product_idx} className="product-card">
                <img src={product.image} alt={product.title} />
                <div className="product-title">{product.title}</div>
                <div className="product-info">
                  <span>{product.location}</span>
                  <span>❤ {product.heart_num} 💬 {product.chat_num}</span>
                </div>
              </div>
            ))
          ) : (
            <div>판매한 상품이 없습니다.</div>
          )}
        </div>
      )}

      {activeTab === '찜 목록' && (
        <div className="product-list">
          {wishlist.length > 0 ? (
            wishlist.map(item => (
              <div key={item.product_idx} className="product-card">
                <img src={item.image} alt={item.title} />
                <div className="product-title">{item.title}</div>
                <div className="product-info">
                  <span>{item.location}</span>
                  <span>❤ {item.heart_num} 💬 {item.chat_num}</span>
                </div>
              </div>
            ))
          ) : (
            <div>찜한 상품이 없습니다.</div>
          )}
        </div>
      )}

      {isAuthModalOpen && (
        <div className="auth-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 1)', zIndex: '999' }}>
          <div className="auth-modal" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed', zIndex: '1000' }}>
            <div className="auth-modal-content">
              <h2>비밀번호 인증</h2>
              <p>내 정보를 수정하려면 비밀번호를 입력해주세요.</p>
              <input type="password" value={password} onChange={handlePasswordChange} />
              <button onClick={handleAuthSubmit}>인증</button>
              <button onClick={handleCloseAuthModal}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {isPointModalOpen && (
        <div className="point-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 1)', zIndex: '999' }}>
          <div className="point-modal" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed', zIndex: '1000' }}>
            <div className="point-modal-content">
              <h2>포인트 충전</h2>
              <p>현재 포인트: {userInfo.points || 0}</p>
              <p>충전할 금액을 입력해주세요.</p>
              <input type="number" value={pointAmount} onChange={handlePointChange} />
              <button onClick={() => handlePointSubmit(false)}>충전</button>
              <button onClick={handleClosePointModal}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {isWithdrawModalOpen && (
        <div className="point-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 1)', zIndex: '999' }}>
          <div className="point-modal" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed', zIndex: '1000' }}>
            <div className="point-modal-content">
              <h2>포인트 인출</h2>
              <p>현재 포인트: {userInfo.points || 0}</p>
              <p>인출할 금액을 입력해주세요.</p>
              <input type="number" value={pointAmount} onChange={handlePointChange} />
              <button onClick={() => handlePointSubmit(true)}>인출</button>
              <button onClick={handleCloseWithdrawModal}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
