import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function StealthLanding() {
  return (
    <div className="min-h-screen bg-[#121212] text-gray-200">
      {/* Stealth Header */}
      <header className="bg-[#1E1E1E] text-gray-200 p-4 border-b border-[#333333]">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <Link href="/">
              <span className="cursor-pointer text-gray-200 hover:text-gray-400">CodeVault</span>
            </Link>
            <span className="relative ml-1">
              <Link href="/app">
                <span className="cursor-pointer text-[#04AA6D] hover:text-[#059862]">H</span>
              </Link>TML Reference
            </span>
          </h1>
          <div>
            <Button variant="outline" className="bg-[#333333] text-gray-200 border-[#444444] hover:bg-[#444444]">
              Access
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto flex flex-col md:flex-row">

        {/* Left Sidebar - Navigation */}
        <aside className="w-full md:w-64 bg-[#1A1A1A] p-4 border-r border-[#333333]">
          <h2 className="text-xl font-bold mb-4 text-gray-200">HTML Reference</h2>
          <nav className="space-y-1">
            {[
              { title: "HTML Home", active: true },
              { title: "HTML Introduction" },
              { title: "HTML Editors" },
              { title: "HTML Basic" },
              { title: "HTML Elements" },
              { title: "HTML Attributes" },
              { title: "HTML Headings" },
              { title: "HTML Paragraphs" },
              { title: "HTML Styles" },
              { title: "HTML Formatting" },
              { title: "HTML Quotations" },
              { title: "HTML Comments" },
              { title: "HTML Colors" },
              { title: "HTML CSS" },
              { title: "HTML Links" },
              { title: "HTML Images" },
              { title: "HTML Tables" },
              { title: "HTML Lists" },
              { title: "HTML Blocks" },
              { title: "HTML Classes" },
              { title: "HTML Id" },
              { title: "HTML Iframes" },
              { title: "HTML JavaScript" },
              { title: "HTML File Paths" },
              { title: "HTML Head" },
              { title: "HTML Layout" },
              { title: "HTML Responsive" },
            ].map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center p-2 rounded ${item.active ? 'bg-[#333333] text-[#04AA6D]' : 'text-gray-300 hover:bg-[#252525]'}`}
              >
                <ChevronRight className="h-4 w-4 mr-2" />
                <span>{item.title}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-[#121212]">
          <h1 className="text-3xl font-bold mb-6 text-gray-200">HTML Reference</h1>
          
          <div className="bg-[#1A1A1A] p-6 rounded-lg mb-8 border border-[#333333]">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">HTML is the standard markup language for Web pages</h2>
            <p className="mb-4 text-gray-300">With HTML you can create your own Website.</p>
            <p className="mb-4 text-gray-300">HTML is easy to learn - You will enjoy it!</p>
            <p className="mb-4 text-gray-300">HTML stands for <span className="text-[#04AA6D]">H</span>yper <span className="text-[#04AA6D]">T</span>ext <span className="text-[#04AA6D]">M</span>arkup <span className="text-[#04AA6D]">L</span>anguage and is the backbone of all web pages.</p>
            <div className="mt-6">
              <Button className="bg-[#333333] hover:bg-[#444444] text-gray-200 mr-4 border border-[#444444]">Study our HTML Reference »</Button>
              <Button variant="outline" className="border-[#444444] text-gray-300 hover:bg-[#333333]">Watch Video Tutorial »</Button>
            </div>
          </div>

          <Card className="mb-8 bg-[#1A1A1A] border border-[#333333] shadow-none">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200">Examples in Each Section</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p className="mb-4">
                Our HTML reference contains hundreds of HTML examples.
              </p>
              <p className="mb-4">
                With our secure editor, you can edit the HTML, and click on a button to view the result.
              </p>
              <p className="mb-4">
                Our examples are simplified for easy understanding and feature enhanced security measures to protect your privacy while learning.
              </p>
              <div className="bg-[#252525] p-4 rounded-md border border-[#333333]">
                <p className="font-mono mb-2 text-[#04AA6D]">Example</p>
                <div className="bg-[#121212] p-4 rounded border border-[#333333] font-mono text-sm text-gray-300">
                  &lt;!DOCTYPE html&gt;<br/>
                  &lt;html&gt;<br/>
                  &lt;head&gt;<br/>
                  &lt;title&gt;Page Title&lt;/title&gt;<br/>
                  &lt;/head&gt;<br/>
                  &lt;body&gt;<br/>
                  <br/>
                  &lt;h1&gt;This is a Heading&lt;/h1&gt;<br/>
                  &lt;p&gt;This is a paragraph.&lt;/p&gt;<br/>
                  <br/>
                  &lt;/body&gt;<br/>
                  &lt;/html&gt;
                </div>
                <Button className="mt-4 bg-[#333333] hover:bg-[#444444] text-gray-200 border border-[#444444]">Try it Yourself »</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-[#1A1A1A] border border-[#333333] shadow-none">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200">HTML Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-300">
                Test your HTML skills with our secure HTML exercises.
              </p>
              <p className="mb-4 text-gray-300">
                All practice sessions are conducted in a secure environment with no tracking or history saving. Your privacy is our priority.
              </p>
              <Button className="bg-[#333333] hover:bg-[#444444] text-gray-200 border border-[#444444]">Start HTML Practice »</Button>
            </CardContent>
          </Card>
          
          <Card className="mb-8 bg-[#1A1A1A] border border-[#333333] shadow-none">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200">Privacy Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-300">
                Our platform is designed with privacy in mind:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>No browser history tracking</li>
                <li>Automatic session clearing</li>
                <li>No cookies or local storage used</li>
                <li>End-to-end encryption for all content</li>
                <li>Self-destructing content with customizable timers</li>
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] text-gray-400 p-8 mt-8 border-t border-[#333333]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-300">References</h3>
              <ul className="space-y-2">
                <li>HTML Reference</li>
                <li>CSS Reference</li>
                <li>JavaScript Reference</li>
                <li>API Reference</li>
                <li>SQL Reference</li>
                <li>Python Reference</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-300">Resources</h3>
              <ul className="space-y-2">
                <li>HTML Resources</li>
                <li>CSS Resources</li>
                <li>JavaScript Resources</li>
                <li>SQL Resources</li>
                <li>Python Resources</li>
                <li>Security Resources</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-300">Examples</h3>
              <ul className="space-y-2">
                <li>HTML Examples</li>
                <li>CSS Examples</li>
                <li>JavaScript Examples</li>
                <li>API Examples</li>
                <li>SQL Examples</li>
                <li>Python Examples</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>CodeVault is optimized for secure learning and reference. Examples are simplified for clarity and security.</p>
            <p className="mt-2">© 2023 CodeVault. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}