import React, { ReactNode } from 'react';
import Link from "next/link";
import Image from "next/image";
import backIcon from '../../../assets/images/icons/back.svg';
import style from './styles.module.scss';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }: PageHeaderProps) => {



  if (title === "Informe os dados para alteração") {

    return (

      <header className={style.pageheader}>
        <div>


        </div>

        <div className={style.headercontent}>
          <strong>{title}</strong>
          {description && <p>{description}</p>}

          {children}
        </div>
      </header>
    );
  } else {

    return (

      <header className={style.pageheader}>

        <div>
          <Link prefetch={false} href="/Landing"        >
            <a>
              <Image
                src={backIcon}
                alt="Voltar"

              />
            </a>
          </Link>
        </div>

        <div>


        </div>

        <div className={style.headercontent}>
          <strong>{title}</strong>
          {description && <p>{description}</p>}

          {children}
        </div>
      </header>
    );

  }
};

export default PageHeader;
