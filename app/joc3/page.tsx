'use client'

import WheelComponent from "@/components/WhellComponent";
import styles from '../../styles/home.module.css'
import { motion } from "framer-motion";

export default function Home() {

  return (

    <div className={styles.background}>




      <div>
      <div id="wheelCircle" 

      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        marginTop: 0, // scoate margin-top dacă vrei pe centrul vertical
        flexDirection: 'column',
      }}
    
    
      >
          <motion.div
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '800px',
          width: '100%',
          marginBottom: '30px',
          textAlign: 'center'
        }}
      >
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>🐝 Fapte bune, fapte rele </h1>
        <p style={{ marginTop: '10px', fontSize: '1.2rem', color: '#666' }}>
          Identifică și discută despre faptele din imagine!
        </p>
      </motion.div>
      <WheelComponent
            segments={[
                { id: 1, src: '/images/poza1.png' },
                { id: 2, src: '/images/poza2.png' },
                { id: 3, src: '/images/poza3.png' },
                { id: 4, src: '/images/poza4.png' },

            ]}
            size={350}
            onFinished={(selected) => console.log('Ai ales:', selected)}
            />

      </div>
      </div>

      </div>
  );
}

// Sa fie o pagina cu mai multe imagini in care sa se regaseasca mai multe persoanje din diferite desene animate sau filme dar sa se regaseasca si baiatul albina si bunica din povestea albinuta 
// In momentul in care se atinge poza corecta sa apara o animatie si daca nu alta

// Am 3 imagini si la refresh sa se aranjeze aleator dar sa nu fie in ordine si sa le pot muta in ordine. Daca muta gresit apare ceva ca e gresit si daca e mutare corecta apare ceva animatie si daca e final apare altceva

// Am ruleta faptelor bune care e o ruleta ce are poze si cand se apasa pe ea sa se invarta si sa se opreasca la o poza aleatoare. Si vreau sa se elimine poza si mai vreau zoom pe poza. Si sa dau eu iar spin daca vreau deci sa pot inchide poza 




