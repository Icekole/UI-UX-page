import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import data from "../data/portfolio.json";

export default function Resources() {
  return (
    <div className="relative">
      <Head>
        <title>设计资源 - {data.name}</title>
        <meta name="description" content="UI/UX 设计常用工具和资源导航" />
      </Head>

      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>

      <div className="container mx-auto mb-10">
        <Header />
        
        <div className="mt-20 laptop:mt-30 p-2 laptop:p-0">
          <h1 className="text-4xl text-bold mb-4">设计资源 🎨</h1>
          <p className="text-xl text-gray-600 mb-10">
            收集了一些常用的设计工具、资源和灵感网站
          </p>

          <div className="grid grid-cols-1 laptop:grid-cols-2 gap-8">
            {data.resources.map((section, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{section.category}</h2>
                <div className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{link.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            {link.desc}
                          </p>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/">
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                ← 返回首页
              </button>
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
