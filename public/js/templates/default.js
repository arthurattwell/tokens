function templateDefault (data) { // eslint-disable-line
  'use strict'
  return `
        <div class="card-content-wrapper">

            <div class="card-content">

                <div class="card-image">
                    ${data.image
                        ? `<img src="${data.image}"
                            style="object-position: ${data.imageAlign ? data.imageAlign : 'initial'}" />`
                    : ''}
                </div>


                <div class="card-text">

                    <div class="card-name">
                        ${data.name}

                        <span class="card-color
                            ${data.cost
                                ? 'card-mana-cost'
                                : 'card-no-mana-cost'}">
                            ${data.manaCostHTML}
                        </span>
                    </div>

                    <div class="card-types
                        ${data.rulesText
                            ? ''
                            : 'card-rules-empty'}">

                        <span class="card-type">
                            ${data.type}
                        </span>

                        <span class="card-subtype">
                            ${data.subtype
                                ? ` — ${data.subtype}`
                            : ''}
                        </span>

                    </div>

                    <div class="card-rules
                        ${data.rulesText
                            ? ''
                            : 'card-rules-empty'}">
                        ${data.rulesText
                            ? `${data.rulesText}`
                        : ''}

                        ${data.power || data.toughness
                            ? `<div class="card-power-toughness">
                                <span class="card-power">
                                    ${data.power}
                                </span>
                                /
                                <span class="card-toughness">
                                    ${data.toughness}
                                </span>
                            </div>`
                        : ''}

                        ${data.loyalty
                            ? `<div class="card-loyalty">
                                ${data.loyalty}
                            </div>`
                        : ''}

                    </div>

                </div><!--.card-text-->

                <div class="card-footer">

                    <div class="card-foot-wrapper">

                        ${data.imageCredit
                            ? `<div class="card-image-credit">
                                ${data.imageCredit}
                            </div>`
                        : ''}

                        <div class="card-footer-text">
                            ${data.footerText ? `${data.footerText}` : ''}
                        </div>

                    </div>

                </div>

            </div>

        </div>
    `
}
