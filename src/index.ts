import "./main/index";
import fixPath from "fix-path";

if (process.env.NODE_ENV === "production") {
  fixPath();
}
