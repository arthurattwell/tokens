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

                    <div class="card-text-body">
                        <div class="card-name">
                            <span class="card-name-text" contenteditable>
                                ${data.name}
                            </span>

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

                            <span class="card-type" contenteditable>
                                ${data.type}
                            </span>

                            <span class="card-subtype" contenteditable>
                                ${data.subtype
                                    ? ` — ${data.subtype}`
                                : ''}
                            </span>

                        </div>

                        <div class="card-rules
                            ${data.rulesText
                                ? ''
                                : 'card-rules-empty'}">
                            <span class="card-rules-text" contenteditable>
                                ${data.rulesText
                                    ? `${data.rulesText}`
                                : ''}
                            </span>

                            ${data.power || data.toughness
                                ? `<div class="card-power-toughness">
                                    <span class="card-power" contenteditable>
                                        ${data.power}
                                    </span>
                                    /
                                    <span class="card-toughness" contenteditable>
                                        ${data.toughness}
                                    </span>
                                </div>`
                            : ''}

                            ${data.loyalty
                                ? `<div class="card-loyalty" contenteditable>
                                    ${data.loyalty}
                                </div>`
                            : ''}

                        </div>
                    </div><!--.card-text-body-->

                    <div class="card-footer">

                        ${data.imageCredit
                            ? `<div class="card-image-credit">
                                ${data.imageCredit}
                            </div>`
                        : ''}

                    </div><!--.card-footer-->

                </div><!--.card-text-->

            </div>

        </div>
    `
}
