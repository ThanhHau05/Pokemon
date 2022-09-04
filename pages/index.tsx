import classNames from "classnames/bind";
import styles from "../styles/Home.module.scss";
const cx = classNames.bind(styles);

export default function Home() {
  return (
    <div className={cx("container")}>
      <h2>Page Home</h2>
    </div>
  );
}
