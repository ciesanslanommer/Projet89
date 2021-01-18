import './Resume.css'

function Resume({node}){
    let description = node.name
    return (
            <div className = 'resume'>
                <p>{description}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec placerat, metus in facilisis iaculis, magna orci eleifend augue, tincidunt sollicitudin quam quam quis arcu. Etiam facilisis neque id congue blandit. Phasellus in posuere arcu, ac porta nisl. Morbi vel sapien eros. Suspendisse potenti. Nam scelerisque eu tellus ac fermentum. In hac habitasse platea dictumst. Maecenas nisl dui, rhoncus sed nisl eget, malesuada accumsan erat. Maecenas vitae mauris id quam ullamcorper vulputate. Donec euismod ut ligula nec gravida.

Pellentesque ut urna id urna efficitur pellentesque eget vitae nibh. Suspendisse potenti. Quisque ac rhoncus neque, viverra aliquet nulla. Donec euismod mollis risus, non bibendum massa ultrices ac. Sed ut sapien urna. Nam aliquet erat faucibus neque egestas tincidunt. Phasellus lobortis lectus sed diam feugiat, placerat volutpat nulla scelerisque. Duis quis lacus sed ipsum mattis vulputate id eget nunc. Morbi et orci magna.</p>
            </div>)
}
export default Resume;