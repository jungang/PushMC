<script>

export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title, info } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }

    if (info) {
      vnodes.push(<i id={info} ref={info} slot='title' class='el-icon-warning'/>)
    }
    return vnodes
  }
}
</script>
