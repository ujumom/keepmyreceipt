/** 알림 창을 예쁘게 바꿔주는 라이브러리 (SweetAlert2) */
import Swal from 'sweetalert2';

/**
 * '확인', '취소' 버튼을 갖는 Confirm 알림 창을 띄웁니다.
 * title은 알림 창의 문구가 됩니다.
 * icon은 warning으로 고정되어 있습니다.
 * */
export const ConfirmSwal = (title: string) =>
  Swal.fire({
    title: title,
    icon: 'warning',
    showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
    confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
    cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
    confirmButtonText: '확인', // confirm 버튼 텍스트 지정
    cancelButtonText: '취소', // cancel 버튼 텍스트 지정
    reverseButtons: false, // 버튼 순서 거꾸로
  });

/** 토스트 버튼을 띄웁니다. */
export const WarningToast = Swal.mixin({
  toast: true,
  position: 'center',
  showConfirmButton: false,
  icon: 'warning',
  timer: 2000,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});
