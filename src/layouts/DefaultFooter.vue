<template>
  <div class="footer__wrap">
    <div class="footer">
      <div class="footer__header">
        <ul class="footer__termsUse">
          <li><router-link class="link" to="/">개인정보처리방침</router-link></li>
          <li><router-link class="link" to="/">이용약관</router-link></li>
        </ul>
        <ul class="footer__utility">
          <li><router-link class="link" to="/">법령정보</router-link></li>
          <li><router-link class="link" to="/">담당자 연락처</router-link></li>
          <li><router-link class="link" to="/">찾아오시는 길</router-link></li>
          <li><router-link class="link" to="/">사이트맵</router-link></li>
        </ul>
      </div>
      <div class="footer__content">
        <p class="footer__address">20112 세종특별자치시 도움6로 42(어진동)<br />@Ministry of the Interior and Safety. All Rights reserved.</p>
        <div class="footer__logo">
          <img src="@/assets/images/common/logo-mois@3x.png" alt="행정안전부 로고" />
          <img src="@/assets/images/common/logo-mois@3x.png" alt="행정안전부 로고" />
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/_mixin';

.footer {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding:0 90px;

  &__wrap {
    padding:54px 0 61px;
    background: #060e23;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    padding-bottom:44px;
  }

  &__termsUse {
    display: flex;
    gap:50px;

    .link {
      color:#fafafa;
      font-size:20px;
      font-weight: 500;

      &:hover,
      &:focus {
        color:#4b75ff;
      }
    }
  }
  &__utility {
    display: flex;
    gap:60px;
    .link {
      color:#b2b5bc;
      font-size:20px;

      &:hover,
      &:focus {
        color:#4b75ff;
      }
    }
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top:60px;
    border-top:1px solid #313747;
  }

  &__address {
    color:#8e929d;
    font-size:18px;
    line-height: 1.94;
  }

  &__logo {
    
    img {
      width:213px;
      & + img {
        margin-left:20px;
      }
    }

  }

}

@include mixin.breakpoint-tablet {
  .footer {
    padding:0 60px;

    &__wrap {
      padding:50px 0 57px;
      background: #060e23;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      padding-bottom:44px;
    }

    &__termsUse {

      .link {
        font-size:18px;
      }
    }

    &__utility {
      gap:49px;

      .link {
        font-size:18px;
      }
    }

    &__content {
      display: flex;
      justify-content: space-between;
      padding-top:60px;
      border-top:1px solid #313747;
    }

    &__address {
      font-size:17px;
      line-height: 1.76;
    }

    &__logo {
      width:178px;
    }
  }
}
@include mixin.breakpoint-mobile {
  .footer {
    position: relative;
    padding:0 20px;

    &__wrap {
      padding:27px 0 23px;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom:18px;
    }

    &__termsUse {
      flex-direction: column;
      gap:20px;
      
      .link {
        font-size:12px;
      }
    }

    &__utility {
      flex-direction: column;
      align-items: flex-end;
      gap:20px;

      .link {
        font-size:12px;
      }
    }

    &__content {
      display: flex;
      justify-content: space-between;
      padding-top:18px;
    }

    &__address {
      width: 100%;
      text-align: center;
      font-size:11px;
      line-height: 1.55;
    }

    &__logo {
      position: absolute;
      left:20px;
      top:10px;
      width:178px;

      img {
        width: 100px;
        & + img {
          margin:5px 0 10px 0;
        }
      }
    }
  }
}
</style>