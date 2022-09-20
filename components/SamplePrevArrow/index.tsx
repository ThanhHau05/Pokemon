import { MdNavigateBefore } from "react-icons/md";
import classNames from "classnames/bind";
import styles from "../SamplePrevArrow/SamplePrevArrow.module.scss";
const cx = classNames.bind(styles);

function SamplePrevArrow({ onClick, isHighLight }) {
  return (
    <div className={cx("prev-wrapper", isHighLight && "show")}>
      <div className={cx("prev-container")} onClick={onClick}>
        <MdNavigateBefore className={cx("prev-icon")} />
      </div>
    </div>
  );
}

export default SamplePrevArrow;
