function Tabela({vetor, selecionar}) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>titulo</th>
                    <th>isbn</th>
                    <th>autor</th>
                    <th>genero</th>
                    <th>data_publicacao</th>
                    <th>Selecionar</th>
                </tr>
            </thead>
            <tbody>
                {
                    vetor.map((obj, indice) => (
                        <tr key={indice}>
                            <td>{indice+1}</td>
                            <td>{obj.titulo}</td>
                            <td>{obj.isbn}</td>
                            <td>{obj.autor}</td>
                            <td>{obj.genero}</td>
                            <td>{obj.data_publicacao}</td>
                            <td><button onClick={()=>{selecionar(indice)}} className="btn btn-success">Selecionar</button></td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
export default Tabela;
