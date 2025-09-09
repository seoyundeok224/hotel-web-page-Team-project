import React from 'react'

const TestPage = ({ title }) => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>{title || '테스트 페이지'}</h1>
            <p>이 페이지가 보인다면 라우팅이 제대로 작동하고 있습니다.</p>
            <p>현재 URL: {window.location.pathname}</p>
        </div>
    )
}

export default TestPage
