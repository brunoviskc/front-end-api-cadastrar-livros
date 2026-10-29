function Formulario({botao, eventoTeclado, cadastrar, obj, cancelar, remover, alterar}){
    return(
        <form>
            <input type="text" value={obj.titulo} onChange={eventoTeclado} name="titulo" placeholder="titulo" className="form-control"/>
            <input type="text" value={obj.isbn} onChange={eventoTeclado} name="isbn" placeholder="isbn" className="form-control"/>
            <input type="text" value={obj.autor} onChange={eventoTeclado} name="autor" placeholder="autor" className="form-control"/>
            <input type="text" value={obj.genero} onChange={eventoTeclado} name="genero" placeholder="genero" className="form-control"/>
            <input type="text" value={obj.data_publicacao} onChange={eventoTeclado} name="data_publicacao" placeholder="data_publicacao" className="form-control"/>

            {
                botao
                ?
                <button type="button" onClick={cadastrar} className="btn btn-primary">Cadastrar</button>
                :
                <div>
                    <button type="button" onClick={alterar} className="btn btn-warning">Alterar</button>
                    <button type="button" onClick={remover} className="btn btn-danger">Remover</button>
                    <button type="button" onClick={cancelar} className="btn btn-secondary">Cancelar</button>
                </div>
            }

        </form>
    )
}
export default Formulario;