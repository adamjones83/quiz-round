import * as React from 'react';
import { render } from '@testing-library/react';
import { TeamView } from '../components/TeamView';
import { saveElement } from './test-utils'

describe('Main Window', async () => {
    const props = {
        color: '#fff',
        quizzers: ['Adam', 'Jake', 'Ellie']
    };
    it('renders with className="team"', async () => {
        const { container } = render(<TeamView {...props} />);
        await saveElement('test-data.html', container);
        expect(container.firstChild).toHaveClass('team');
    });
});