import { useTranslation } from "react-i18next"
import Layout from "./layout"

function App() {
  const { t } = useTranslation()

  return (
    <Layout>
      {t("welcome")}
    </Layout>
  )
}

export default App
