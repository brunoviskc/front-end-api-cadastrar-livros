import './App.css';
import Formulario from "./Formulario";
import Tabela from "./Tabela";
import {useEffect, useState} from "react";

function App() {

  // Objeto biblioteca
  const bibliotecas = {

    id: 0,
    titulo:'',
    isbn:'',
    autor:'',
    genero:'',
    data_publicacao:''

  }

    // useState
  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [biblioteca, setBiblioteca] = useState([]);
  const [objBiblioteca, setObjBiblioteca] = useState(bibliotecas);

  // useEffect
    useEffect(() => {
        fetch('http://localhost:8080/listar')
            .then(retorno => retorno.json())
            .then(retorno_convertido => setBiblioteca(retorno_convertido));
    }, [])

  // Obter os dados do formulário

  const aoDigitar = (e) => {
    setObjBiblioteca({...objBiblioteca, [e.target.name]:e.target.value})
  }

  // Cadastrar Livro
  const cadastrar = () => {
    fetch('http://localhost:8080/cadastrar', {
      method:'POST',
      body:JSON.stringify(objBiblioteca),
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      }
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {

        if(retorno_convertido.mensagem !== undefined){
          alert(retorno_convertido.mensagem);
        }else {
          setBiblioteca([...biblioteca, retorno_convertido]);
          alert('Cadastro com sucesso!!');
          limparFormulario();
        }

      })

      
  }
  // Limpar formulário
  const limparFormulario = () => {
    setObjBiblioteca(bibliotecas);
    setBtnCadastrar(true);
  }

  //Selecionar Livro

  const selecionarLivro = (indice) => {
    setObjBiblioteca(biblioteca[indice]);
    setBtnCadastrar(false);
  }

  //Remover Livro
  const remover = () => {
    fetch('http://localhost:8080/remover/'+objBiblioteca.id, {
      method:'DELETE',
      headers:{
        'Content-type':'application.json',
        'Accept':'application/json'
      }
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        alert(retorno_convertido.mensagem);

        let vetorTemp = [...biblioteca];

        let indice = vetorTemp.findIndex((livro) =>{
          return livro.id === objBiblioteca.id;
        })

        vetorTemp.splice(indice, 1);
        setBiblioteca(vetorTemp);

        limparFormulario();

      })
  }

  // Alterar Livro
  const alterar = () => {
    fetch('http://localhost:8080/alterar', {
      method: 'PUT',
      body:JSON.stringify(objBiblioteca),
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      }
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido =>{

        if(retorno_convertido.mensagem !== undefined){
          alert(retorno_convertido.mensagem);
        }else {
          alert('Livro alterado com sucesso!!')

          let vetorTemp = [...biblioteca];

          let indice = vetorTemp.findIndex((livro) => {
            return livro.id === objBiblioteca.id;
          });

          vetorTemp[indice] = objBiblioteca;
          setBiblioteca(vetorTemp);

          limparFormulario();
        }
      })
  }


  return (
    <div className="App">
      <Formulario botao={btnCadastrar} eventoTeclado={aoDigitar} cadastrar={cadastrar} obj={objBiblioteca} cancelar={limparFormulario} remover={remover} alterar={alterar}/>
      <Tabela vetor={biblioteca} selecionar={selecionarLivro} />
    </div>
  );
}

export default App;
