import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <main>
        <nav>
          <Link href="/auth/sign-in">Sign In</Link>
        </nav>
        <h1>Welcome to the app</h1>
      </main>
    </div>
  );
}
