
'use client'

import styles from '../../styles/home.module.css'
import ImageSelectionGame from "@/components/ImageSelectionGame";
import dynamic from 'next/dynamic';
const ComponentaClientOnly = dynamic(() => import('@/components/ImageSelectionGame'), {
    ssr: false
  });
export default function Home() {

  return (

    <div className={styles.background}>


            <ComponentaClientOnly
            correctImages={[
                '/images/albinapoveste.png',
                '/images/baiatu.png',
                '/images/bunicadinpoveste.png',
            ]}
            wrongImages={[
                '/images/bunicu.png',
                '/images/fluture.png',
                '/images/cenusareasa.png',
                '/images/blui.png',
                '/images/olaf.png',
            ]}
            />


      </div>
  );
}

// Sa fie o pagina cu mai multe imagini in care sa se regaseasca mai multe persoanje din diferite desene animate sau filme dar sa se regaseasca si baiatul albina si bunica din povestea albinuta 
// In momentul in care se atinge poza corecta sa apara o animatie si daca nu alta

// Am 3 imagini si la refresh sa se aranjeze aleator dar sa nu fie in ordine si sa le pot muta in ordine. Daca muta gresit apare ceva ca e gresit si daca e mutare corecta apare ceva animatie si daca e final apare altceva

// Am ruleta faptelor bune care e o ruleta ce are poze si cand se apasa pe ea sa se invarta si sa se opreasca la o poza aleatoare. Si vreau sa se elimine poza si mai vreau zoom pe poza. Si sa dau eu iar spin daca vreau deci sa pot inchide poza 




