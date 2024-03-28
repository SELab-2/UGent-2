import {JSX} from "react";
import {PieChart} from "react-minimal-pie-chart";
import {IoIosStats} from "react-icons/io";

export default function Statistics(): JSX.Element {
    const mockdata = [
        {title: 'Succes', value: 10, color: '#50C878'},
        {title: 'Fail', value: 15, color: '#C13C37'},
        {title: 'Nothing yet', value: 20, color: '#D3D3D3'},
    ]

    // default functie voor bulma modal gehaald van
    document.addEventListener('DOMContentLoaded', () => {
        // Functions to open and close a modal
        function openModal($el: HTMLElement | null) {
            if ($el === null) {
                return;
            }
            $el.classList.add('is-active');
        }

        function closeModal($el: Element | null) {
            if ($el === null) {
                return;
            }
            $el.classList.remove('is-active');
        }

        // Add a click event on buttons to open a specific modal
        (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
            const modal = "modal-stats"
            const $target = document.getElementById(modal);

            $trigger.addEventListener('click', () => {
                openModal($target);
            });
        });

        // Add a click event on various child elements to close the parent modal
        (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
            const $target = $close.closest('.modal');

            $close.addEventListener('click', () => {
                closeModal($target);
            });
        });
    });

    return (
        <>
            <button className="js-modal-trigger button is-primary is-pulled-right" data-target="modal-stats">
                <span className="icon is-small">
                    <IoIosStats/>
                </span>
                <span>Statistieken</span>
            </button>
            <div id="modal-stats" className="modal">
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Indieningen:</p>
                        <button className="delete" aria-label="close"></button>
                    </header>
                    <section className="modal-card-body">
                        <PieChart
                            label={({dataEntry}) => `${dataEntry.title}: ${Math.round(dataEntry.percentage)} %`}
                            labelStyle={() => ({
                                fontSize: '5px',
                            })}
                            segmentsShift={0.2}
                            radius={45}
                            data={mockdata}
                        />
                    </section>
                    <footer className="modal-card-foot"/>
                </div>
            </div>
        </>
    )
}