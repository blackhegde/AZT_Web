import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "./button";
import { useTranslation } from "../../../hooks/useTranslation";

const Footer: React.FC = () => {
  const { t } = useTranslation();  
  // const Home = () => {};  
    return (
        <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                    src="/logo.png" 
                    alt="TechSolve Logo" 
                    className="h-12 w-13 md:h-20 md:w-20 lg:h-20 lg:w-24 object-contain -ml-2 -my-1"
                  />
                <span className="text-background font-bold font-heading">AZT Viet Nam<br />Technology Company Limited</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <h1>{t('footer.title')}</h1>
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-background">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Solutions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-background">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-background">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2024 TechSolve. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon icon="solar:twitter-bold" className="size-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon icon="solar:linkedin-bold" className="size-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon icon="solar:github-bold" className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
}

export default Footer;