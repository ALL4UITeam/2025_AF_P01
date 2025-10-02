<!-- [URL 예외처리 루틴] - api가 아니면서 알 수 없는 url 호출시 -->
<template>
    <div class="not-found">
        <h1>잘못된 접근입니다!</h1>
        <p></p>
        <router-link to="/">홈으로 돌아가기</router-link>
    </div>
</template>

<script>
export default {
    name: 'NotFound',
};
</script>

<style scoped lang="scss">
.not-found {
    text-align: center;
    margin-top: 50px;

    h1 {
        font-size: 100px;
        margin-bottom: 20px;
    }

    p {
        font-size: 20px;
        margin-bottom: 30px;
    }
}

</style>