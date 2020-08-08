const home = async (ctx) => {
    const html = `
        <div style="display: flex; flex-direction: column;justify-content: center;align-items: center;height: 100%;">
            <p>Welcome!!!</p>
        </div>
    `
    ctx.body = html
}

export default home
