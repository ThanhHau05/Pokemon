import { MdNavigateNext } from "react-icons/md";
import classNames from "classnames/bind";
import styles from "../SampleNextArrow/SampleNextArrow.module.scss";
const cx = classNames.bind(styles);

function SampleNextArrow({ onClick, isHighLight }) {
  return (
    <div className={cx("next-wrapper", isHighLight && "show", "a")}>
      <div className={cx("next-container")} onClick={onClick}>
        <MdNavigateNext className={cx("next-icon")} />
      </div>
    </div>
  );
}

export default SampleNextArrow;
